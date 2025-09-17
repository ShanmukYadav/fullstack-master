pipeline {
    agent any

    environment {
        // Codacy token pulled from Jenkins credentials
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')
        // GitHub PAT (must also be stored in Jenkins credentials)
        GITHUB_PAT = credentials('github-pat-global')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-pat-global',
                    url: 'https://github.com/ShanmukYadav/fullstack-master.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --coverage'
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                script {
                    if (env.CODACY_PROJECT_TOKEN == null || env.CODACY_PROJECT_TOKEN.trim() == '') {
                        error("❌ Codacy token not set! Please configure Jenkins credentials with ID 'codacy-project-token'.")
                    } else {
                        sh '''
                          curl -Ls https://coverage.codacy.com/get.sh | bash
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully and coverage uploaded to Codacy!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for details.'
        }
    }
}
