import Heading from './Heading';

export default {
  title: 'Heading',
  component: Heading
};

export const WithoutKicker = () => (
  <>
    <Heading level={1}>h1</Heading>
    <Heading level={2}>h2</Heading>
    <Heading level={3}>h3</Heading>
    <Heading level={4}>h4</Heading>
  </>
);

WithoutKicker.storyName = 'Without Kicker';

export const WithKicker = () => (
  <>
    <Heading level={1} kicker="Heading 1 Kicker">
      h1
    </Heading>
    <Heading level={2} kicker="Heading 2 Kicker">
      h2
    </Heading>
    <Heading level={3} kicker="Heading 3 Kicker">
      h3
    </Heading>
    <Heading level={4} kicker="Heading 4 Kicker">
      h4
    </Heading>
  </>
);

WithKicker.storyName = 'With Kicker';
