default: test

test:
	npm test

setup:
	npm install
	rm -rf node_modules/*/.git
	echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

clean:

veryclean:
