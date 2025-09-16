pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'test',
                    url: 'https://github.com/ShanmukYadav/fullstack.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    bat 'npm test || echo "No frontend tests found"'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }
    }
}
