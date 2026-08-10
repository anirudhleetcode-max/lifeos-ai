from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
import litellm
import uuid

# Graceful Qdrant Connection
try:
    client = QdrantClient(host="qdrant", port=6333)
    COLLECTION_NAME = "lifeos_memory"
    
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
except Exception as e:
    print(f"Vector DB not ready yet: {e}")

def save_memory(text: str, role: str):
    print(f"Memory saved: [{role}] {text}")