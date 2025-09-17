pipeline {
    agent any

    environment {
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')
    }

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build')
    }

    tools {
        nodejs 'NodeJS' // Name of your NodeJS installation in Jenkins
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH}"]],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/ShanmukYadav/fullstack-master.git']]
                ])
            }
        }
        

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npx jest --passWithNoTests --watchAll=false --coverage'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    sh 'chmod -R +x node_modules/.bin'
                    sh 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage'
                }
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                dir('.') {
                    sh '''
                    # Download Codacy coverage reporter
                    curl -Ls https://coverage.codacy.com/get.sh -o get.sh
                    chmod +x get.sh
                    
                    # Upload frontend coverage
                    ./get.sh report -r frontend/coverage/lcov.info -t $CODACY_PROJECT_TOKEN
                    
                    # Upload backend coverage (if exists)
                    if [ -f backend/coverage/lcov.info ]; then
                        ./get.sh report -r backend/coverage/lcov.info -t $CODACY_PROJECT_TOKEN
                    fi
                    '''
                }
            }
        }

        // Added stage to build Docker images for frontend and backend
        stage('Build Docker Images') {
            steps {
                script {
                    // tag images with branch and build number (or 'local' if not available)
                    def imageTag = "${params.BRANCH}-${env.BUILD_NUMBER ?: 'local'}"

                    dir('frontend') {
                        echo "Building frontend Docker image with tag: frontend:${imageTag}"
                        sh "docker build -t frontend:${imageTag} ."
                    }

                    dir('backend') {
                        echo "Building backend Docker image with tag: backend:${imageTag}"
                        sh "docker build -t backend:${imageTag} ."
                    }

                    echo "Docker images built: frontend:${imageTag}, backend:${imageTag}"
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up workspace..."
                cleanWs()
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs!"
        }
    }
}