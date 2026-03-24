
## Setup overview:

Containers:  
- Container for Postgres (official image)
- Container for FastAPI
- Container for React (vite)


Communication:
- Browser communicates with React with port mapping of localhost.
- Communication between React and FastAPI containers is done with a port mapping of localhost.
- Communication between FastAPI and Postgres containers is done with a docker network

### 1. Change Vite to run on 0.0.0.0 instead of on localhost

In the "dev" script in package.JSON, add the --host flag to the vite command:

```bash
"vite --host"
```

This way, later when Vite will run inside a container, it'll make vite listen not only
to the container's localhost, but to all interfaces (0.0.0.0). Thus, Vite will listen to messages coming from the host.

---

### 2. Make sure that Vite has the correct IP and port of the backend.

If FastAPI runs on its default dev port then your .env file, needs to have:  

```bash
VITE_API_URL=http://127.0.0.1:8000/
```

---

### 3. Configure CORS in FastAPI

In FastAPI (different repo), make sure localhost:5173 is in the allowed CORS origins. This works for both running Vite in a
container and running Vite directly on the machine.

```python
CORS_ALLOWED_ORIGINS: list[str] = [
    "http://localhost:5173",
]
```

Explanation:  
The browser sends a request to localhost:5173 and since the machine's port 5173 will be mapped to a port in the frontend
container, the request will reach the container. But the browser is not aware that this is what happens behind the
scenes, and so, it also doesn't know that the response came from a container. As far as it's concerned, it got the
frontend from the machine's localhost and this is the page's origin. Result: Any API requests from this JS will have
origin http://localhost:5173.

---

### 4. Create the image

```bash
docker build --no-cache -t eap-frontend-image .
```

---

### 5. Run a container

```bash
docker run -p 5173:5173 --name eap-frontend-container eap-frontend-image
```

Explanation:

- Inside the container, Vite will run on its default port of 5173.
- In step 1 we already set Vite to listen to all network interfaces and not just the container's localhost.
- That took care of the IP level, but we will also need the correct port. The browser will send messages to localhost:
  5173, and since we mapped the ports, Docker will be forward it to the container's eth0 (the container's virtual
  Ethernet interface) on port 5173. Since Vite is listening to all interfaces (0.0.0.0) on port 5173, the request will
  reach it.