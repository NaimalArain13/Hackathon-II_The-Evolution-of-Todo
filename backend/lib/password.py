"""
Password hashing utilities using bcrypt via passlib.

This module provides secure password hashing and verification functions
for user authentication. Passwords are hashed using bcrypt with 12 rounds
(passlib default), providing strong protection against brute-force attacks.

Security Features:
- Bcrypt algorithm (slow by design, resistant to brute-force)
- Automatic salt generation
- Constant-time password verification
- OWASP recommended approach

Example:
    from lib.password import hash_password, verify_password

    # Hash password during registration
    hashed = hash_password("SecurePass123!")

    # Verify password during login
    is_valid = verify_password("SecurePass123!", hashed)  # True
    is_valid = verify_password("WrongPassword", hashed)   # False
"""

from passlib.context import CryptContext

# Configure password context with bcrypt
# - schemes=["bcrypt"]: Use only bcrypt algorithm
# - deprecated="auto": Automatically deprecate weaker schemes if added later
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.

    This function generates a secure hash of the password with automatic
    salt generation. The resulting hash is safe to store in the database.

    Args:
        password (str): Plaintext password to hash

    Returns:
        str: Bcrypt hash string (60 characters, format: $2b$12$...)

    Example:
        >>> hashed = hash_password("MyPassword123!")
        >>> len(hashed)
        60
        >>> hashed.startswith('$2b$')
        True

    Note:
        - Never store or log plaintext passwords
        - Hash format: $2b$12$[22-char-salt][31-char-hash]
        - Each hash is unique due to random salt
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a bcrypt hash.

    This function uses constant-time comparison to prevent timing attacks.
    It automatically extracts the salt from the hash and compares.

    Args:
        plain_password (str): Plaintext password to verify
        hashed_password (str): Bcrypt hash from database

    Returns:
        bool: True if password matches, False otherwise

    Example:
        >>> hashed = hash_password("CorrectPassword")
        >>> verify_password("CorrectPassword", hashed)
        True
        >>> verify_password("WrongPassword", hashed)
        False

    Security Note:
        - Use this for login authentication
        - Always use generic error messages: "Invalid email or password"
        - Never reveal whether email or password was wrong (prevents user enumeration)
    """
    return pwd_context.verify(plain_password, hashed_password)
