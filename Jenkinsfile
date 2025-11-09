pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Pull the latest code from GitHub
                git branch: 'main', url: 'https://github.com/<your-username>/<your-repo-name>.git'
            }
        }

        stage('Build Docker Containers') {
            steps {
                script {
                    echo "Building Docker containers using Docker Compose..."
                    // Stop any running containers
                    sh 'docker-compose down || true'
                    // Build images and run containers in detached mode
                    sh 'docker-compose up -d --build'
                }
            }
        }

        stage('Verify Running Containers') {
            steps {
                script {
                    echo "Checking running Docker containers..."
                    sh 'docker ps'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline finished successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo 'Cleaning up if needed...'
            // Optional: Uncomment to stop containers after build
            // sh 'docker-compose down'
        }
    }
}
