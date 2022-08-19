setup: redis
	docker build . -t captcha-dev -f Dockerfile.dev
	docker network create fake
dev:
	docker run --env-file app.env --net fake -v `pwd`:/app -p 8080:80 --rm -it --name captcha-dev node-dev yarn dev
dev-log:
	docker logs captcha-dev
dev-rm:
	docker stop captcha-dev
redis:
	docker run -d --rm --name redis --net fake redis:alpine3.15
clean:
	docker rm -q captcha-dev redis
	docker network rm fake