package main

import (
	"os"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type File struct{}

func (f *File) OpenFile() (string, error) {
	dialog := application.OpenFileDialog()
	dialog.SetTitle("Select File")
	dialog.AddFilter("JSON Files", "*.json")
	dialog.AddFilter("HAR Files", "*.har")
	dialog.AllowsOtherFileTypes(true)
	path, err := dialog.PromptForSingleSelection()
	if err != nil {
		return "", err
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	return string(data), nil
}

func (f *File) SaveFile(text string) (string, error) {
	dialog := application.SaveFileDialog()
	dialog.AddFilter("JSON Files", "*.json")
	dialog.AllowsOtherFileTypes(true)
	dialog.CanCreateDirectories(true)
	dialog.SetFilename("demystify.json")
	path, err := dialog.PromptForSingleSelection()
	if err != nil {
		return "", err
	}

	if err := os.WriteFile(path, []byte(text), 0644); err != nil {
		return "", err
	}

	return path, nil
}
