import { useState, useEffect } from "react";
import { useIntegrityMonitor } from "../hooks/useIntegrityMonitor";
import { useParams, useNavigate } from "react-router-dom";
import { startInterview, submitAnswer } from "../api/interview";

function InterviewRoom() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("loading"); // loading | in-progress | completed | error
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { violationCount, lastWarning } = useIntegrityMonitor(
    interviewId,
    status === "in-progress",
  );

  useEffect(() => {
    async function init() {
      try {
        const res = await startInterview(type);
        setInterviewId(res.data.interviewId);
        setQuestion(res.data.question);
        setStatus("in-progress");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to start interview");
        setStatus("error");
      }
    }
    init();
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await submitAnswer(interviewId, answer.trim());
      if (res.data.status === "completed") {
        setStatus("completed");
      } else {
        setQuestion(res.data.question);
        setAnswer("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ maxWidth: 700, margin: "60px auto" }}>
        Starting your {type} interview...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ maxWidth: 700, margin: "60px auto" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/interview-select")}>Back</button>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div style={{ maxWidth: 700, margin: "60px auto" }}>
        <h2>Interview Completed</h2>
        <p>Your {type} round has ended. Thanks for completing it.</p>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "60px auto" }}>
      {violationCount > 0 && (
        <div
          style={{
            background: "#fee",
            border: "1px solid red",
            padding: "8px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {lastWarning} (Violations: {violationCount})
        </div>
      )}

      {!document.fullscreenElement && (
        <button
          onClick={() => document.documentElement.requestFullscreen()}
          style={{ marginBottom: "16px" }}
        >
          Enter Fullscreen Mode
        </button>
      )}
      <h2>{type} Interview</h2>
      {question?.isFollowUp && (
        <p style={{ fontStyle: "italic" }}>Follow-up question</p>
      )}
      <p style={{ fontSize: "18px", marginTop: "16px" }}>{question?.text}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
          style={{ width: "100%" }}
          placeholder="Type your answer here..."
          disabled={submitting}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          style={{ marginTop: "12px" }}
        >
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
      </form>
    </div>
  );
}

export default InterviewRoom;
