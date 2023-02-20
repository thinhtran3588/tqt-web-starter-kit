interface Props {
  children?: React.ReactNode;
}

export default function Layout({children}: Props): JSX.Element {
  return (
    <>
      <div>main layout</div>
      {children}
    </>
  );
}
