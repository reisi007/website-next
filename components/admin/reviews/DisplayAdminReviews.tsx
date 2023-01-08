import { useMemo } from 'react';
import {
  Cell, Pie, PieChart,
} from 'recharts';
import classNames from 'classnames';
import { LoadedReview } from './reviews.api';
import { useFontSize } from '../../utils/textWidth';
import { useModal } from '../../images-next/utils/Modal';
import { Review } from './Review';
import { StyledButton } from '../../images-next/button/StyledButton';
import { ResponsiveContainer } from '../../utils/ResponsiveContainer';

export function DisplayChart({ data }: { data: Array<LoadedReview> }) {
  const [avg, cnt] = useMemo(() => {
    const filteredData = data.map((e) => e.rating)
      .filter((e) => e !== null && !Number.isNaN(e));
    const count = filteredData.length;
    const sum = filteredData
      .reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0;
    const average = Math.round(sum / count);
    return [average, count] as const;
  }, [data]);
  const label = `${avg} / 100 (${cnt ?? 0})`;

  return (
    <>
      <ResponsiveContainer className="mx-auto w-full md:w-1/2">
        {(width) => <PieChartChart width={width} label={label} avg={avg} />}
      </ResponsiveContainer>
      <span className="text-center text-xl font-medium" />
    </>
  );
}

export function DisplayReviewData({ data }: { data: Array<LoadedReview> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((d) => <DisplaySingleReview {...d} key={`${d.creation_date} ${d.name}`} />)}
    </div>
  );
}

type PieChartChartProps = { width: number, label: string, avg: number };

function PieChartChart({
  width,
  label,
  avg,
}: PieChartChartProps) : JSX.Element {
  const size = Math.min(500, width);
  const fontSize = useFontSize(label, { maxWidth: size / 2 });
  const fill = classNames({
    red: avg >= 0 && avg < 20,
    orange: avg >= 40 && avg < 60,
    yellow: avg >= 60 && avg < 80,
    green: avg >= 80,
  });
  return (
    <PieChart
      className="mb-4"
      width={size}
      height={size / 2 + 5}
    >
      <Pie
        cy={size / 2}
        startAngle={180}
        endAngle={0}
        outerRadius={0.5 * size}
        innerRadius={0.3 * size}
        dataKey="value"
        isAnimationActive={false}
        data={[{
          value: avg,
        }, {
          value: 100 - avg,
        }]}
      >
        <Cell fill={fill} stroke={fill} z="2" />
        <Cell fill="white" stroke={fill} strokeDasharray="4" z="1" />

      </Pie>
      <text
        x={size / 2}
        y={size / 2 - fontSize}
        style={{ fontSize: `${fontSize}px` }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </PieChart>
  );
}

function DisplaySingleReview(data: LoadedReview) {
  const [copyModal, openCopyModal] = useModal('Review kopieren', () => <CopyReview data={data} />);
  return (
    <Review {...data}>
      <StyledButton
        onClick={() => openCopyModal(true)}
        className="mt-2"
      >
        Kopieren
      </StyledButton>
      {copyModal}
    </Review>
  );
}

export function CopyReview({ data }: { data: LoadedReview }) {
  const reviewContent = useMemo(() => {
    const lines = new Array<string>();
    lines.push(
      '---',
      'image: ???',
      'type: boudoir | beauty | business | sport | pärchen | live',
      `name: ${data.name}`,
      `date: ${data.creation_date.split(' ')[0]}`,
    );
    if (data.rating) {
      lines.push(`rating: ${data.rating}`);
    }
    lines.push('---');
    if (data.review_public) {
      lines.push(data.review_public);
    }

    return lines.join('\r\n');
  }, [data]);
  return (
    <textarea
      onClick={(e) => {
        e.currentTarget.select();
        navigator.clipboard?.writeText(reviewContent);
      }}
      className="h-60 w-full font-mono text-sm"
      readOnly
      value={reviewContent}
    />
  );
}
