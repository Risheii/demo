# API Endpoints – Payload Reference

---

## 1. `POST /chat`

**Purpose:** Send a user message to the chatbot and receive a response.

**Request Body (JSON):**
```json
{
  "user_id": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "user_id": "string",
  "status": "success"
}
```

---

## 2. `POST /clear`

**Purpose:** Clear the chat history for a specific user.

**Request Body (JSON):**
```json
{
  "user_id": "string"
}
```

**Response:**
```json
{
  "status": "cleared",
  "user_id": "string",
  "message": "Chat history cleared successfully"
}
```

---

## 3. `POST /history`

**Purpose:** Retrieve the full chat history of a specific user.

**Request Body (JSON):**
```json
{
  "user_id": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "user_id": "string",
  "history": [
    {
      "type": "HumanMessage | AIMessage",
      "content": "string"
    }
  ]
}
```

---

## 4. `GET /active_users`

**Purpose:** Get the count of currently active users.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "active_users": 5
}
```

---

## 5. `POST /webhook`

**Purpose:** Stripe webhook handler. Listens for `checkout.session.completed` events to delete a reserved slot and book an appointment automatically.

**Request Body:** Raw Stripe webhook payload (sent by Stripe, not manually)

**Headers Required:**
```
stripe-signature: <stripe_signature_value>
```

**Response (on success):**
```json
{
  "status": "success",
  "message": "Appointment booked"
}
```

**Stripe Metadata Expected:**
```json
{
  "reservationUid": "string",
  "cal_api_key": "string",
  "customer_email": "string",
  "customer_name": "string",
  "slotStart": "ISO datetime string",
  "eventTypeId": "string"
}
```

---

## 6. `POST /delete_item`

**Purpose:** Queue a job to delete a collection (RAG data) for a specific company and department.

**Request Body (JSON):**
```json
{
  "company_id": "string",
  "department": "string"
}
```

**Response:**
```json
{
  "status": "queued",
  "message": "Task added to processing queue",
  "job_id": "string",
  "collection_name": "companyId_department"
}
```

---

## 7. `POST /add_item`

**Purpose:** Upload a file (PDF, DOCX, or TXT) and queue it for ingestion into the RAG collection for a company/department.

**Request Body (`multipart/form-data`):**

| Field        | Type   | Description                        |
|--------------|--------|------------------------------------|
| `file`       | File   | The document to upload (.pdf, .docx, .txt) |
| `company_id` | string | Company identifier                 |
| `department` | string | Department name                    |

**Response:**
```json
{
  "status": "queued",
  "message": "Task added to processing queue",
  "job_id": "string",
  "collection_name": "companyId_department"
}
```

---

## 8. `GET /job_status/{job_id}`

**Purpose:** Check the status of a queued background job.

**Path Parameter:**
- `job_id` – The job ID returned from `/add_item` or `/delete_item`

**Response (completed):**
```json
{
  "job_id": "string",
  "status": "completed",
  "result": {}
}
```

**Response (running/queued):**
```json
{
  "job_id": "string",
  "status": "queued | started | finished | failed",
  "result": null,
  "meta": {},
  "retries_left": 3
}
```

**Response (not found):**
```json
{
  "job_id": "string",
  "status": "not_found",
  "message": "Job not found. It may have been completed and cleaned up."
}
```

---

## 9. `GET /failed_jobs`

**Purpose:** List all failed background jobs.

**Request Body:** None

**Response:**
```json
{
  "failed_jobs_count": 2,
  "jobs": [
    {
      "job_id": "string",
      "func_name": "string",
      "created_at": "ISO datetime",
      "ended_at": "ISO datetime",
      "error": "string (first 200 chars)"
    }
  ]
}
```

---

## 10. `POST /retry_failed_job/{job_id}`

**Purpose:** Manually requeue a failed job for reprocessing.

**Path Parameter:**
- `job_id` – The ID of the failed job to retry

**Request Body:** None

**Response (success):**
```json
{
  "status": "success",
  "message": "Job <job_id> requeued for processing"
}
```

**Response (not in failed state):**
```json
{
  "status": "error",
  "message": "Job is not in failed state. Current status: <status>"
}
```