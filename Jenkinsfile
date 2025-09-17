pipeline {
    agent any

    environment {
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')
    }

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build')
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo "Checking out branch ${params.BRANCH}..."
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
                    echo "Installing frontend dependencies..."
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    echo "Installing backend dependencies..."
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    echo "Running frontend tests..."
                    sh 'npx jest --passWithNoTests --watchAll=false --coverage'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    echo "Running backend tests..."
                    sh 'chmod -R +x node_modules/.bin'
                    sh 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage'
                }
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                dir('.') {
                    echo "Uploading coverage to Codacy..."
                    sh '''
                    curl -Ls https://coverage.codacy.com/get.sh -o get.sh
                    chmod +x get.sh

                    ./get.sh report -r frontend/coverage/lcov.info -t $CODACY_PROJECT_TOKEN

                    if [ -f backend/coverage/lcov.info ]; then
                        ./get.sh report -r backend/coverage/lcov.info -t $CODACY_PROJECT_TOKEN
                    fi
                    '''
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def imageTag = "${params.BRANCH}-${env.BUILD_NUMBER ?: 'local'}"

                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {

                        echo "Logging in to Docker Hub with username: $DOCKERHUB_USERNAME"

                        // Docker login
                        sh "echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin"

                        // Build, tag, and push frontend image
                        dir('frontend') {
                            def frontendImage = "${DOCKERHUB_USERNAME}/devops-pipeline-frontend:${imageTag}"
                            def frontendLatest = "${DOCKERHUB_USERNAME}/devops-pipeline-frontend:latest"
                            sh """
                            docker build -t ${frontendImage} .
                            docker tag ${frontendImage} ${frontendLatest}
                            docker push ${frontendImage}
                            docker push ${frontendLatest}
                            """
                            echo "Frontend images pushed: ${frontendImage} and ${frontendLatest}"
                        }

                        // Build, tag, and push backend image
                        dir('backend') {
                            def backendImage = "${DOCKERHUB_USERNAME}/devops-pipeline-backend:${imageTag}"
                            def backendLatest = "${DOCKERHUB_USERNAME}/devops-pipeline-backend:latest"
                            sh """
                            docker build -t ${backendImage} .
                            docker tag ${backendImage} ${backendLatest}
                            docker push ${backendImage}
                            docker push ${backendLatest}
                            """
                            echo "Backend images pushed: ${backendImage} and ${backendLatest}"
                        }

                        // Logout from Docker Hub after push
                        sh "docker logout"
                    }
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
