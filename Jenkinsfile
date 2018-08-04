properties([
    [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '5']],
    pipelineTriggers([[$class: 'GitHubPushTrigger']]),
])

timestamps {
    node () {
        stage ('git') {
            checkout scm
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
