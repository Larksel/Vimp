import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

type SectionProps = {
  name: string;
} & Props;

type OptionProps = {
  name: string;
} & Props;

export function Section(props: SectionProps) {
  return (
    <section className={props.className}>
      <h3 className='text-lg font-bold'>{props.name}</h3>
      {props.children}
    </section>
  );
}

export function Description(props: Props) {
  return <p className={props.className}>{props.children}</p>;
}

export function Option(props: OptionProps) {
  return (
    <div className='flex items-center justify-between'>
      <h6>{props.name}</h6>
      {props.children}
    </div>
  );
}
