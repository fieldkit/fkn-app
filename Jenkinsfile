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
  make
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
