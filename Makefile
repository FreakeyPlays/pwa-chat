build:
	docker build -t pwa-chat -f Dockerfile .

run:
	docker run -p 8080:80 pwa-chat

dev:
	npm start