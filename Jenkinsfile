pipeline {
    agent any

    environment {
        SONARQUBE = 'sonar'
        NEXUS_REGISTRY = 'nexus.imcc.com:8083'
        IMAGE_NAME = 'static-site'
        K8S_DEPLOYMENT = 'deployment.yaml'
        K8S_SERVICE = 'service.yaml'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git', branch: 'main'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh "sonar-scanner"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest ."
            }
        }

        stage('Login to Nexus Docker Registry') {
            steps {
                sh "docker login ${NEXUS_REGISTRY} -u student -p Imcc@2025"
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f ${K8S_DEPLOYMENT}"
                sh "kubectl apply -f ${K8S_SERVICE}"
            }
        }
    }
}
