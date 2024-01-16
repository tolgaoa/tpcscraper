# Makefile

SRC_DIR := ./cmd

MODULE_NAME := pcscraper

build:
	go build -o ./bin/pcscraper $(SRC_DIR)/main.go

# Run "make image VERSION=x.x.x"

run:
	go run $(SRC_DIR)/main.go

deps:
	go mod download

clean:
	rm -f ./bin/proxyapp

.PHONY: build run deps clean
