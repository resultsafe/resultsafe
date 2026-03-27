import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Type-Safe Error Handling',
    Svg: require('@site/static/img/undraw_code_review.svg').default,
    description: (
      <>
        Catch errors at compile time with the Result type. No more unexpected exceptions in production.
      </>
    ),
  },
  {
    title: 'Rust-Style Result',
    Svg: require('@site/static/img/undraw_server_down.svg').default,
    description: (
      <>
        Familiar API for Rust developers. Ok and Err constructors with pattern matching.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    Svg: require('@site/static/img/undraw_open_source.svg').default,
    description: (
      <>
        Lightweight library with no external dependencies. Tree-shakable and bundle-friendly.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
