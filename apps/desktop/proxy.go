package main

import (
	"fmt"
	"net"
	"net/url"
	"time"

	"github.com/google/martian"
	"github.com/google/martian/har"
	"github.com/wailsapp/wails/v3/pkg/application"
)

// Proxy is a struct that represents a martian proxy
type Proxy struct {
	upstreamPort  int
	downstreamURL string
	har           *har.Logger
	proxy         *martian.Proxy
	done          chan struct{}
}

type ProxyConfig struct {
	UpstreamPort  int
	DownstreamURL string
}

func NewProxy() Proxy {
	p := Proxy{}
	p.init(&ProxyConfig{})
	close(p.done)
	return p
}

func (p *Proxy) init(config *ProxyConfig) {
	p.proxy = martian.NewProxy()
	p.har = har.NewLogger()
	p.downstreamURL = config.DownstreamURL
	p.upstreamPort = config.UpstreamPort
	p.done = make(chan struct{})

	p.proxy.SetRequestModifier(p.har)
	p.proxy.SetResponseModifier(p.har)
}

func (p *Proxy) Start(config *ProxyConfig) error {
	if p.IsActive() {
		return nil
	}
	p.init(config)

	parsedURL, err := url.Parse(p.downstreamURL)
	if err != nil {
		application.Get().EmitEvent("proxy:error", "Failed to parse downstream url")
		return fmt.Errorf("failed to parse downstream url: %v", err)
	}
	p.proxy.SetDownstreamProxy(parsedURL)

	l, err := net.Listen("tcp", fmt.Sprintf(":%d", p.upstreamPort))
	if err != nil {
		l.Close()
		application.Get().EmitEvent("proxy:error", fmt.Sprintf("Failed to listen on port %d", p.upstreamPort))
		return fmt.Errorf("failed to listen on port %d: %v", p.upstreamPort, err)
	}

	go func() {
		proxyServer := p.proxy
		go func() {
			<-p.done
			proxyServer.Close()
			l.Close()
		}()

		if err := proxyServer.Serve(l); err != nil {
		}
	}()

	go func() {
		ticker := time.NewTicker(time.Second)
		for {
			select {
			case <-p.done:
				ticker.Stop()
				return
			case <-ticker.C:
				p.exportHAR()
			}
		}
	}()

	return nil
}

func (p *Proxy) Stop() {
	select {
	case <-p.done:
		return
	default:
	}
	close(p.done)
	p.har.Reset()
}

func (p *Proxy) IsActive() bool {
	select {
	case <-p.done:
		return false
	default:
	}
	return true
}

func (p *Proxy) exportHAR() {
	harExport := p.har.ExportAndReset()
	if len(harExport.Log.Entries) > 0 {
		application.Get().EmitEvent("proxy:har_entries", harExport.Log.Entries)
	}
}
