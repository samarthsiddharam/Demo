pipeline {

    // *** RUN PIPELINE ON BUILT-IN NODE (FIX FOR CRASHING PODS) ***
    agent { label 'built-in' }

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
                git url: 'https://github.com/samarthsiddharam/Demo.git', branch: 'main'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh """
                        ${tool 'sonar-scanner'}/bin/sonar-scanner
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    echo "Building Docker image..."
                    docker build -t ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Login to Nexus Docker Registry') {
            steps {
                sh """
                    echo "Logging in to Nexus..."
                    docker login ${NEXUS_REGISTRY} -u student -p Imcc@2025
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                    echo "Pushing Docker image to Nexus..."
                    docker push ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    echo "Deploying to Kubernetes..."
                    kubectl apply -f ${K8S_DEPLOYMENT}
                    kubectl apply -f ${K8S_SERVICE}
                """
            }
        }
    }
}
