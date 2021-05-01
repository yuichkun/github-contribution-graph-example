import { NextPage } from "next";
import { ContributionChart } from '../components/ContributionChart'
import { retrieveContributionData } from "../modules/github";

const MAIN_AUTHOR_USER_NAME = 'yuichkun'

type Props = {
  userName: string
  totalContributions: number
  contributionDays: Externals.Github.ContributionDay[]
}


const IndexPage: NextPage<Props> = ({ contributionDays, totalContributions, userName }) => {
  return (
    <div>
      <h1>GitHub Contributions of <a target="_blank" rel="noopener" href={`https://github.com/${userName}`}>{userName}</a></h1>
      <h2>Total Contributions: {totalContributions}</h2>
      <h2>Accumulation of Contributions Over One Year</h2>
      <ContributionChart contributionDays={contributionDays}/>
    </div>
  )
}

IndexPage.getInitialProps = async (context) => {
  const userName = context.query['user_name'] as string || MAIN_AUTHOR_USER_NAME
  const { data: { user: { contributionsCollection: { contributionCalendar: { totalContributions, weeks }} }} } = await retrieveContributionData(userName)
  const contributionDays = weeks.reduce(((prev, cur) => {
    return prev.concat(cur.contributionDays)
  }),[] as Externals.Github.ContributionDay[])
  return {
    userName,
    totalContributions,
    contributionDays
  }
}

export default IndexPage