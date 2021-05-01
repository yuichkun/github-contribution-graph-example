import { parseISO } from "date-fns";
import format from "date-fns/format";
import React, { FC } from "react";
import { createContainer, VictoryAxis, VictoryBrushContainer, VictoryChart, VictoryGroup, VictoryLine, VictoryTheme, VictoryTooltip } from "victory";
import { useWindowSize } from "./hooks/useWindowResize";
import { useZoom } from "./hooks/useZoom";

type Props = {
  contributionDays: Externals.Github.ContributionDay[]
};

type FormattedStats = Omit<Externals.Github.ContributionDay, 'date'> & {
  date: Date
}

function formatter(timeSeries: Externals.Github.ContributionDay[]): FormattedStats[] {
  return timeSeries.map((t) => ({
    ...t,
    date: parseISO(t.date)
  }))
}

const CONTRIBUTION_COUNT_LINE_COLOR = "#a7def3"

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi") as any;

const labelPresenter = ({datum}: {datum: Externals.Github.ContributionDay}) => `Date: ${format(new Date(datum.date), 'dd/MM/yyyy')} \nContributions: ${datum.contributionCount}\n`

export const ContributionChart: FC<Props> = ({ contributionDays }) => {
  const { zoomDomain, selectedZoomDomain, setSelectedZoomDomain, setZoomDomain } = useZoom()
  const formattedTimeSeries = formatter(contributionDays);
  const size = useWindowSize()
  return (
    <div>
      <VictoryChart
        width={size.width}
        theme={VictoryTheme.grayscale}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomVoronoiContainer
            responsive={false}
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={setSelectedZoomDomain}
          />
        }
      >
        <VictoryGroup>
          <VictoryLine
            style={{
              data: { stroke: CONTRIBUTION_COUNT_LINE_COLOR},
              parent: { border: "1px solid #ccc" },
            }}
            x="date"
            y="contributionCount"
            labels={labelPresenter}
            labelComponent={<VictoryTooltip/>}
            data={formattedTimeSeries}
          />
        </VictoryGroup>
      </VictoryChart>
      <VictoryChart
        width={size.width}
        height={90}
        scale={{ x: "time" }}
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        containerComponent={
          <VictoryBrushContainer
            responsive={false}
            brushDimension="x"
            brushDomain={selectedZoomDomain}
            onBrushDomainChange={setZoomDomain}
          />
        }
      >
        <VictoryAxis
          tickFormat={(x) => {
            const formatted = format(x, 'yyyy-MM-dd')
            return formatted
          }}
        />
        <VictoryLine
          style={{
            data: { stroke: CONTRIBUTION_COUNT_LINE_COLOR },
          }}
          x="date"
          y="contributionCount"
          data={formattedTimeSeries}
        />
      </VictoryChart>
    </div>
  );
};
