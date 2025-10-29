const testQueries = [
  {
    category: "Property Law",
    query: "What is the process for house registration after parents' demise?",
    expectedKeywords: ["mutation", "legal heir", "revenue records", "death certificate"],
    testName: "Property Registration Query",
  },
  {
    category: "Succession Law",
    query: "How does Muslim succession law work in India?",
    expectedKeywords: ["Sharia", "heirs", "shares", "succession"],
    testName: "Muslim Succession Query",
  },
  {
    category: "Legal Procedures",
    query: "What documents are needed for property mutation?",
    expectedKeywords: ["death certificate", "affidavit", "property papers", "revenue"],
    testName: "Legal Documents Query",
  },
  {
    category: "Power of Attorney",
    query: "Can I use Power of Attorney for property matters?",
    expectedKeywords: ["POA", "notarized", "authorize", "property"],
    testName: "POA Query",
  },
  {
    category: "Legal Heirship",
    query: "What is a legal heirship certificate?",
    expectedKeywords: ["legal heir", "certificate", "revenue", "succession"],
    testName: "Legal Heirship Query",
  },
]

async function testChatbotAccuracy() {
  console.log("Starting Legal Chatbot Accuracy Tests...\n")

  let passedTests = 0
  let failedTests = 0
  const results = []

  for (const test of testQueries) {
    try {
      console.log(`Testing: ${test.testName}`)
      console.log(`Query: "${test.query}"`)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: test.query }),
      })

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      const responseText = data.message.toLowerCase()

      // Check if response contains expected keywords
      const foundKeywords = test.expectedKeywords.filter((keyword) => responseText.includes(keyword.toLowerCase()))

      const accuracy = (foundKeywords.length / test.expectedKeywords.length) * 100
      const passed = accuracy >= 60 // 60% keyword match threshold

      if (passed) {
        passedTests++
        console.log(`✓ PASSED (${accuracy.toFixed(0)}% accuracy)`)
      } else {
        failedTests++
        console.log(`✗ FAILED (${accuracy.toFixed(0)}% accuracy)`)
      }

      results.push({
        testName: test.testName,
        category: test.category,
        query: test.query,
        passed,
        accuracy: accuracy.toFixed(0),
        foundKeywords,
        missingKeywords: test.expectedKeywords.filter((k) => !foundKeywords.includes(k)),
        responseLength: data.message.length,
        sources: data.sources?.length || 0,
      })

      console.log(`Found keywords: ${foundKeywords.join(", ") || "none"}`)
      console.log(
        `Missing keywords: ${test.expectedKeywords.filter((k) => !foundKeywords.includes(k)).join(", ") || "none"}`,
      )
      console.log("---\n")
    } catch (error) {
      failedTests++
      console.log(`✗ ERROR: ${error.message}\n`)
      results.push({
        testName: test.testName,
        category: test.category,
        query: test.query,
        passed: false,
        error: error.message,
      })
    }
  }

  // Summary
  console.log("\n=== TEST SUMMARY ===")
  console.log(`Total Tests: ${testQueries.length}`)
  console.log(`Passed: ${passedTests}`)
  console.log(`Failed: ${failedTests}`)
  console.log(`Success Rate: ${((passedTests / testQueries.length) * 100).toFixed(0)}%`)
  console.log("\n=== DETAILED RESULTS ===")
  console.log(JSON.stringify(results, null, 2))

  return {
    totalTests: testQueries.length,
    passed: passedTests,
    failed: failedTests,
    successRate: ((passedTests / testQueries.length) * 100).toFixed(0),
    results,
  }
}

// Run tests if this is the main module
if (typeof window === "undefined") {
  testChatbotAccuracy().then((summary) => {
    console.log("\nTest execution completed!")
  })
}

export { testChatbotAccuracy }
