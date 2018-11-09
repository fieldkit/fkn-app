@Library('conservify') _

conservifyProperties([ disableConcurrentBuilds() ])

timestamps {
    node () {
        try {
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

            notifySuccess()
        }
        catch (Exception e) {
            notifyFailure()
            throw e;
        }
    }
}
