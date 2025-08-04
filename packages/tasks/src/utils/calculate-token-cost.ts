interface CalculateTokenCostProps {
  inputTokens: number
  outputTokens: number
  embeddingTokens: number
  costs: {
    inputCostPer1K: number
    outputCostPer1K: number
    embeddingCostPer1K: number
  }
}

export function calculateTokenCost({
  embeddingTokens,
  inputTokens,
  outputTokens,
  costs
}: CalculateTokenCostProps) {
  const inputCost = (inputTokens / 1000) * costs.inputCostPer1K
  const outputCost = (outputTokens / 1000) * costs.outputCostPer1K

  const embeddingCost = (embeddingTokens / 1000) * costs.embeddingCostPer1K

  return {
    inputCost: Math.round(inputCost * 100),
    outputCost: Math.round(outputCost * 100),
    embeddingCost: Math.round(embeddingCost * 100),
    totalCost: Math.round((inputCost + outputCost + embeddingCost) * 100)
  }
}
