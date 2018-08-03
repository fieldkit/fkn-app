timestamps {
    node () {
        stage ('git') {
            checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: 'https://github.com/fieldkit/app.git']]])
        }

        stage ('build') {
            sh """
npm --version
node --version
npm install
npm test
"""
	      }
    }
}
