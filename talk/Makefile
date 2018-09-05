.PHONY: present
present: \
	compiled/reverse_proxy.svg \
	compiled/readme_workflow.svg \
	compiled/docker_workflow.svg \
	compiled/proxy_component.svg \
	downloads/images/works_on_my_machine.jpg \
	downloads/images/compose_logo.png \
	downloads/images/nginx_logo.svg \
	downloads/images/react_logo.svg \
	downloads/images/express_logo.png \
	downloads/images/webpack_logo.svg \
	downloads/images/zoolander_read.jpg \
	downloads/images/programmer_two_states.jpg \
	downloads/images/no_idea.jpg \
	| downloads/fonts/orkney downloads/images/dockerlogos
	hovercraft -p 0.0.0.0:8000 talk.rst

compiled/%.svg: %.plantuml | compiled
	java -jar ~/java/plantuml.jar -tsvg -o compiled $<

compiled:
	mkdir -p compiled

downloads/fonts/orkney: downloads/orkney.zip | downloads/fonts
	mkdir -p downloads/fonts/orkney && \
	unzip -d downloads/fonts/orkney downloads/orkney.zip

downloads/orkney.zip: | downloads
	curl -o downloads/orkney.zip \
	https://fontlibrary.org/assets/downloads/orkney/99f93483b92aaa9f10d3780aba2997e7/orkney.zip

downloads/images/works_on_my_machine.jpg: | downloads/images
	curl -L -o downloads/images/works_on_my_machine.jpg \
	https://i1.wp.com/www.developermemes.com/wp-content/uploads/2013/12/Defect-In-Production-Works-On-My-Machine.jpg?w=400

downloads/images/compose_logo.png: | downloads/images
	curl -L -o downloads/images/compose_logo.png \
	https://github.com/docker/compose/raw/master/logo.png


downloads/images/webpack_logo.svg: | downloads/images
	curl -o downloads/images/webpack_logo.svg \
	https://webpack.js.org/assets/icon-square-big.svg

downloads/images/react_logo.svg: | downloads/images
	curl -L -o downloads/images/react_logo.svg \
	https://raw.githubusercontent.com/facebook/create-react-app/next/packages/react-scripts/template/src/logo.svg

downloads/images/express_logo.png: | downloads/images
	curl -L -o downloads/images/express_logo.png \
	https://i.cloudup.com/zfY6lL7eFa-3000x3000.png

downloads/images/nginx_logo.svg: | downloads/images
	curl -o downloads/images/nginx_logo.svg \
	https://cdn-1.wp.nginx.com/wp-content/uploads/2018/03/icon-NGINX-OSS.svg

downloads/images/zoolander_read.jpg: | downloads/images
	curl -L -o downloads/images/zoolander_read.jpg \
	https://media.makeameme.org/created/how-can-the.jpg

downloads/images/programmer_two_states.jpg: | downloads/images
	curl -L -o downloads/images/programmer_two_states.jpg \
	https://digitalsynopsis.com/wp-content/uploads/2015/03/web-designer-developer-jokes-humour-funny-41.jpg

downloads/images/no_idea.jpg: | downloads/images
	curl -L -o downloads/images/no_idea.jpg \
	https://i.kym-cdn.com/photos/images/original/000/234/739/fa5.jpg

downloads/images/dockerlogos: downloads/dockerlogos.zip | downloads/images
	mkdir -p downloads/images/dockerlogos && \
	unzip -d downloads/images/dockerlogos downloads/dockerlogos.zip

downloads/dockerlogos.zip: | downloads
	curl -o downloads/dockerlogos.zip \
	https://www.docker.com/sites/default/files/legal/docker_logos_2018.zip

downloads/fonts:
	mkdir -p downloads/fonts

downloads:
	mkdir -p downloads

downloads/images:
	mkdir -p downloads/images

.PHONY: clean
clean:
	rm -rf downloads compiled
