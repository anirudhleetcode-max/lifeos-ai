import os
from qdrant_client import QdrantClient
from qdrant_client.http import models

class LifeOSRAGService:
    def __init__(self):
        try:
            self.client = QdrantClient(host="qdrant", port=6333)
            self.collection_name = "lifeos_memory"
            self._init_collection()
        except Exception:
            self.client = None

    def _init_collection(self):
        if not self.client:
            return
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        if not exists:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
            )

    def add_memory(self, user_email: str, text: str, message_id: int):
        if not self.client:
            return
        # Simple pseudo-embedding hash/vector length 384 for demo stability without heavy ML download weight
        import hashlib
        hash_object = hashlib.sha256(text.encode())
        hex_dig = hash_object.digest()
        vector = [float(b) / 255.0 for b in hex_dig * 6][:384]

        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=message_id,
                    vector=vector,
                    payload={"user_email": user_email, "text": text}
                )
            ]
        )

    def search_memory(self, user_email: str, query: str):
        if not self.client:
            return []
        import hashlib
        hash_object = hashlib.sha256(query.encode())
        hex_dig = hash_object.digest()
        vector = [float(b) / 255.0 for b in hex_dig * 6][:384]

        try:
            hits = self.client.search(
                collection_name=self.collection_name,
                query_vector=vector,
                query_filter=models.Filter(
                    must=[models.FieldCondition(key="user_email", match=models.MatchValue(value=user_email))]
                ),
                limit=3
            )
            return [hit.payload["text"] for hit in hits if hit.payload]
        except Exception:
            return []
