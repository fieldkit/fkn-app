default: app/secrets.js test

app/secrets.js: app/secrets.js.template
	cp app/secrets.js.template app/secrets.js

test: node_modules
	jest --ci --silent

setup:
	echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

prettier:
	prettier --write './app/**/*.{ts,js,css,json}'

node_modules:
	npm install
	git config core.hooksPath .githooks
	rm -rf node_modules/*/.git

clean:

veryclean:
	rm -rf node_modules
