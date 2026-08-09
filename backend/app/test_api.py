import uuid
from fastapi.testclient import TestClient
from backend.app.main import app

# Create a TestClient instance using our FastAPI app
client = TestClient(app)

def test_read_root():
    """Test that the server is alive and returns the welcome message."""
    response = client.get("/")
    
    # Assertions are checks. If this is False, the test fails.
    assert response.status_code == 200
    assert response.json() == {"message": "LifeOS AI Backend is running!"}

def test_register_and_login_user():
    """Test the full authentication flow: Register -> Login."""
    
    # Generate a random email so the test doesn't fail on the second run
    # due to the "Email already registered" database constraint.
    random_email = f"test_{uuid.uuid4()}@example.com"
    password = "supersecretpassword123"
    
    # 1. Test Registration
    response_reg = client.post(
        "/api/v1/auth/register",
        json={"email": random_email, "password": password}
    )
    assert response_reg.status_code == 201, f"Registration failed: {response_reg.text}"
    
    data = response_reg.json()
    assert data["email"] == random_email
    assert "id" in data
    
    # 2. Test Login with the same credentials
    response_login = client.post(
        "/api/v1/auth/login",
        json={"email": random_email, "password": password}
    )
    assert response_login.status_code == 200, "Login failed"
    
    token_data = response_login.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"