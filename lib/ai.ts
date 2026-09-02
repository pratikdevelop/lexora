import { generateText } from "ai"

export async function reviewContract(contractContent: string) {
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `You are a legal expert. Review the following contract and provide:
1. Key findings (bullet points)
2. Risk assessment (low/medium/high)
3. Recommendations

Contract:
${contractContent}

Provide structured feedback with clear sections.`,
  })
  return text
}

export async function performLegalResearch(query: string) {
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `You are a legal research assistant. Research and provide comprehensive information about: ${query}
    
Provide relevant legal precedents, statutes, and practical guidance where applicable.`,
  })
  return text
}

export async function checkCompliance(checkType: string, subject: string) {
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `You are a compliance officer. Perform a ${checkType} compliance check for: ${subject}

Provide:
1. Compliance status (compliant/non-compliant/needs review)
2. Key issues if any
3. Required actions
4. Timeline for implementation`,
  })
  return text
}
