import {
  StateSchema,
  type GraphNode,
  StateGraph,
  Graph,
  START,
  END,
} from "@langchain/langgraph";
import { gemini, cohere, mixtral, mistral, openrouter } from "./model.ai.js";
import z from "zod";
import { createAgent, HumanMessage, providerStrategy } from "langchain";

const state = new StateSchema({
  problem: z.string().default(""),
  model_1: z.string().default(""),
  model_2: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_reasoning: z.string().default(""),
    solution_2_reasoning: z.string().default(""),
  }),
});

const solutionNode: GraphNode<typeof state> = async (state) => {
  const model_1 =
    state.model_1 === "mixtral"
      ? mixtral
      : state.model_1 === "cohere"
        ? cohere
        : state.model_1 === "mistral"
          ? mistral
          : openrouter;
  const model_2 =
    state.model_2 === "mixtral"
      ? mixtral
      : state.model_2 === "cohere"
        ? cohere
        : state.model_2 === "mistral"
          ? mistral
          : openrouter;

  const [model_1_response, model_2_response] = await Promise.all([
    model_1.invoke(state.problem),
    model_2.invoke(state.problem),
  ]);

  return {
    solution_1: model_1_response.text,
    solution_2: model_2_response.text,
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  const judge_model = gemini;
  const { solution_1, solution_2, problem } = state;

  const judge = createAgent({
    model: judge_model,
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string(),
      }),
    ),
    systemPrompt: `You are an expert AI judge responsible for evaluating two solutions to the same problem.

Your goal is to determine which solution is better using strict, objective reasoning.

Evaluate both solutions based on:

1. Correctness — Is the solution logically and factually correct?
2. Completeness — Does it fully solve the problem?
3. Efficiency — Is the approach optimal in terms of time and space?
4. Clarity — Is the explanation clear and easy to understand?
5. Code Quality — If code is present, is it clean, correct, and well-structured?

Rules you MUST follow:

* Be unbiased and do not favor any solution based on length, style, or wording.
* Do not assume anything beyond what is written.
* If a solution is incorrect, penalize it heavily.
* If both are incorrect, clearly state that.
* If both are correct, prefer the one with better reasoning and clarity.
* Prefer simple and correct solutions over complex but unnecessary ones.
* Be strict in scoring. Avoid giving high scores unless fully justified.

Output requirements:

* Clearly compare both solutions.
* Assign a score to each solution.
* Provide a concise reasoning of both solution.

Think carefully before deciding. Your evaluation must be consistent, logical, and defensible.
`,
  });

  const judge_response = await judge.invoke({
    messages: [
      new HumanMessage(`
            problem: ${problem}
            solution 1: ${solution_1}
            solution 2: ${solution_2}
            Evaluate the two solutions and provide scores and reasoning.
            `),
    ],
  });

  const {
    solution_1_score,
    solution_2_score,
    solution_1_reasoning,
    solution_2_reasoning,
  } = judge_response.structuredResponse;

  return {
    judge: {
      solution_1_score,
      solution_2_score,
      solution_1_reasoning,
      solution_2_reasoning,
    },
  };
};

const graph = new StateGraph(state)
  .addNode("solution", solutionNode)
  .addNode("judge_node", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge_node")
  .addEdge("judge_node", END)
  .compile();

export default async function (
  problem: string,
  model_1: string,
  model_2: string,
) {
  const result = await graph.invoke({
    problem: problem,
    model_1: model_1,
    model_2: model_2,
  });

  return result;
}
