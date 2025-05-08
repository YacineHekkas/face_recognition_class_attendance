# Django Project Setup Guide

This guide will help you set up a Django development environment with a virtual environment and install the required packages.



## Setup Instructions

### 1. Create a Virtual Environment

First, create a virtual environment to isolate your project dependencies:

```bash
python -m venv env
```

#### Activate the Virtual Environment

- **For Linux/macOS**:
  ```bash
  source env/bin/activate
  ```

- **For Windows**:
  ```bash
  env\Scripts\activate
  ```

### 2. Install Required Packages

With the virtual environment activated, install the necessary packages:

```bash
pip install django djangorestframework psycopg2-binary
```

This will install:
- Django (web framework)
- Django REST Framework (for building APIs)
- psycopg2-binary (PostgreSQL database adapter)
