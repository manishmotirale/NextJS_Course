"use client";

import { useEffect, useState } from "react";
import { getAllSubmissionByCurrentForProblem } from "../actions";

export function useSubmissionHistory(id: string) {
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const response = await getAllSubmissionByCurrentForProblem(id);

        if (response.success) {
          setSubmissionHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching submission history: ", error);
      }
    };

    fetchSubmissionHistory();
  }, [id]);
 
  return { submissionHistory };
}
