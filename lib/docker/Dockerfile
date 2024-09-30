# Use the official Node.js 18 image with linux/amd64 platform
FROM --platform=linux/amd64 node:18

# Set the working directory inside the container
WORKDIR /PrinceJS

# Install git so we can clone the repository
RUN apt-get update && apt-get install -y git

# Clone the GitHub repository (PrinceJS in this case)
RUN git clone https://github.com/bdllerena/PrinceJS.git .


# Install dependencies
RUN npm install

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
