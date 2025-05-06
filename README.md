# Cloud Canvas

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Usage](#usage)
7. [Configuration](#configuration)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## Overview

Cloud Canvas empowers developers with limited local hardware to run PyTorch workloads on AWS serverless infrastructure, paying only for the compute they consume ([GitHub][1], [Amazon Web Services, Inc.][2]). Through a browser‑based code editor, users submit PyTorch scripts to an AWS Lambda function packaged as a Docker image with all dependencies pre‑installed, then receive execution results back in real time ([PyTorch][3], [AWS Documentation][4]).

## Features

- **Browser‑based Editor**
  Interactive code editing powered by Monaco (or CodeMirror), with syntax highlighting for Python/PyTorch ([PyTorch][5]).
- **Serverless Execution**
  Execution in AWS Lambda container images (up to 10 GiB) for seamless scaling and isolation ([Amazon Web Services, Inc.][2], [AWS Documentation][6]).
- **Pay‑Per‑Use**
  No EC2 instances to provision—billed per‑request duration and memory consumption ([AWS Documentation][7]).
- **Pre‑built Docker Environment**
  A multi‑stage Dockerfile installs PyTorch, CUDA libraries (if needed), and the Lambda runtime interface ([Docker Documentation][8], [AWS Documentation][6]).

## Architecture

```
[Browser]
   ↓ HTTP/S
[Next.js Frontend]
   ↓ AWS SDK
[AWS Lambda (Container)] ←— Docker image in ECR
   ↓ Execution of PyTorch code
[Response → Frontend]
```

- **Next.js** handles routing and UI ([GitHub][1], [AWS Documentation][9]).
- **AWS Lambda** runs user code inside a container, stored in ECR ([AWS Documentation][4], [AWS Documentation][6]).
- **Amplify (Gen 2)** manages backend resources (Auth, Data) via IaC ([Amplify Docs][10], [AWS Documentation][11]).

## Prerequisites

- **Node.js** ≥ 18.x and **npm/yarn/pnpm** ([GitHub][1])
- **AWS CLI** v2 configured with an IAM user/role having Lambda/ECR permissions ([AWS Documentation][4])
- **Docker** ≥ 25.0.0 for building container images locally ([AWS Documentation][6])

## Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/aravinth-krishna/cloud-canvas.git
   cd cloud-canvas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure AWS Amplify**

   ```bash
   amplify init
   amplify push
   ```

   This provisions Lambda, ECR, and other backend resources ([AWS Documentation][12]).

4. **Build & Deploy Containers**

   ```bash
   docker build -t cloud-canvas-lambda .
   aws ecr create-repository --repository-name cloud-canvas-lambda
   docker tag cloud-canvas-lambda:latest <your‑ecr‑uri>
   docker push <your‑ecr‑uri>
   ```

   Pushes your Docker image to Amazon ECR ([AWS Documentation][4]).

## Usage

- **Run locally**:

  ```bash
  npm run dev
  npx ampx sandbox
  ```

  Visit [http://localhost:3000](http://localhost:3000) and enter PyTorch code in the editor ([GitHub][1]).

- **Submit code**: Click “Run” → Lambda executes code → output appears in the console panel.

## Configuration

- **Lambda Function**: Adjust memory/timeout in `amplify/backend/function/.../function-parameters.json`.

## Deployment

1. **Frontend**
   Connect GitHub to Amplify Hosting for CI/CD. Amplify auto‑detects Next.js apps (v12–15) and deploys SSR ([AWS Documentation][13]).
2. **Backend**
   `npx ampx push` updates Lambda containers on code changes.
3. **Domain**
   Configure a custom domain in the Amplify Console for production SSL.

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/...]`)
3. Commit your changes (`git commit -m "Add ..."`)
4. Push to your fork & open a PR

Please follow the existing code style and update tests/components as needed.

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details ([Wikipedia][14]).

## Contact

**Aravinth Krishna** – [@aravinth-krishna](https://github.com/aravinth-krishna)
Project Link: [https://github.com/aravinth-krishna/cloud-canvas](https://github.com/aravinth-krishna/cloud-canvas) ([GitHub][1])
