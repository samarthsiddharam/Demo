pipeline {
    agent any

    environment {
        SONARQUBE = 'sonar'                 // Jenkins → Sonar Server name
        REGISTRY = 'nexus.imcc.com:8083'    // Nexus Docker registry
        IMAGE = 'student/static-site'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your/repo.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh "sonar-scanner"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $REGISTRY/$IMAGE:latest ."
            }
        }

        stage('Login to Nexus Docker Registry') {
            steps {
                sh "docker login $REGISTRY -u student -p Imcc@2025"
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push $REGISTRY/$IMAGE:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                kubectl apply -f deployment.yaml
                kubectl apply -f service.yaml
                """
            }
        }
    }
}
