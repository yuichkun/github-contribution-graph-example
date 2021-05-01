import { NextPage } from "next";
import { ContributionChart } from '../components/ContributionChart'
import { retrieveContributionData } from "../modules/github";

type Props = {
  contributionDays: Externals.Github.ContributionDay[]
}

const IndexPage: NextPage<Props> = ({ contributionDays }) => {
  return (
    <ContributionChart contributionDays={contributionDays}/>
  )
}

IndexPage.getInitialProps = async () => {
  const { data: { user: { contributionsCollection: { contributionCalendar: { totalContributions, weeks }} }} } = await retrieveContributionData('yuichkun')
  console.log(totalContributions)
  const contributionDays = weeks.reduce(((prev, cur) => {
    return prev.concat(cur.contributionDays)
  }),[] as Externals.Github.ContributionDay[])
  return {
    contributionDays
  }
}

export default IndexPage