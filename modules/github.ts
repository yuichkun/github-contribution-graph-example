import fetch from 'node-fetch'
const TOKEN = process.env.GITHUB_TOKEN
const query = `
query($userName:String!) {
  user(login: $userName){
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`
export async function retrieveContributionData(userName: string): Promise<Externals.Github.ApiResponse> {
  const variables = `
  {
    "userName": "${userName}"
  }
`
  const body = {
    query,
    variables
  }
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body)
  })
  return res.json()
}