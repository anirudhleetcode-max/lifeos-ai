.PHONY: up down logs clean struct

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v

struct:
	mkdir -p backend/app/api/v1
	mkdir -p backend/app/core
	mkdir -p backend/app/db
	mkdir -p backend/app/models
	mkdir -p backend/app/services/ai
	mkdir -p backend/app/tests
	mkdir -p frontend
	touch backend/app/__init__.py
	touch backend/app/main.py
	touch backend/requirements.txt
	@echo "Folder structure initialized."