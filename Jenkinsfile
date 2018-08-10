@Library('conservify') _

conservifyProperties()

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
