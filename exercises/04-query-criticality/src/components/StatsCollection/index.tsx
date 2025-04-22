import dayjs from "dayjs";
import { Text, Paper, Group, rem } from "@mantine/core";
import classes from "./StatsCollection.module.css";
import { IconBike } from "@tabler/icons-react";

type Stat = {
  icon: typeof IconBike;
  label: string;
  value: string;
};

type Props = {
  data?: Stat[];
};

export function StatsCollection({ data }: Props) {
  const date = new Date();

  const stats = data?.map((stat) => (
    <Paper className={classes.stat} radius="md" shadow="md" p="xs" key={stat.label}>
      <stat.icon
        style={{ width: rem(32), height: rem(32) }}
        className={classes.icon}
        stroke={1.5}
      />
      <div>
        <Text className={classes.label}>{stat.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>{stat.value}</span>
        </Text>
      </div>
    </Paper>
  ));

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <div className={classes.date}>
          <Text className={classes.day}>{dayjs(date).format("DD")}</Text>
          <Text className={classes.month}>{dayjs(date).format("MMMM")}</Text>
        </div>
      </div>
      <Group style={{ flex: 1 }}>{stats}</Group>
    </div>
  );
}
