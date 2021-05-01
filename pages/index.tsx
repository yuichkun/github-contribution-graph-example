import { NextPage } from "next";
import { FC, SyntheticEvent, useRef } from "react";
import { ContributionChart } from '../components/ContributionChart';
import { retrieveContributionData } from "../modules/github";
import Head from 'next/head'

const MAIN_AUTHOR_USER_NAME = 'yuichkun'

type Props = {
  userName: string
  totalContributions: number
  contributionDays: Externals.Github.ContributionDay[]
}


const ChartArea: FC<Props> = ({ totalContributions, contributionDays, userName }) => (
  <>
    <h1>GitHub Contributions of <a target="_blank" rel="noopener" href={`https://github.com/${userName}`}>{userName}</a></h1>
    <h2>Total Contributions: {totalContributions}</h2>
    <h2>Accumulation of Contributions Over One Year</h2>
    <ContributionChart contributionDays={contributionDays} />
  </>
)

const SearchArea: FC<Pick<Props, 'userName'>> = ({userName}) => {
  const ref = useRef<HTMLInputElement>(null)
  function onClick(e: SyntheticEvent) {
    e.preventDefault()
    const newUserName = ref.current?.value || MAIN_AUTHOR_USER_NAME
    window.document.location.href = `/?user_name=${newUserName}`
  }
  return (
    <div style={{marginTop: '120px'}}>
      Type in Another GitHub Account ID Below to See Contributions
      <form style={{marginTop: '12px'}}>
        <input ref={ref} type="text" placeholder={userName}/>
        <button type="submit" onClick={onClick}>Look</button>
      </form>
    </div>
  )
}

const IndexPage: NextPage<Props> = ({ contributionDays, totalContributions, userName }) => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ textAlign: 'center', fontFamily: 'roboto' }}>
        <ChartArea contributionDays={contributionDays} totalContributions={totalContributions} userName={userName} />
        <SearchArea userName={userName}/>
      </div>
    </>
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