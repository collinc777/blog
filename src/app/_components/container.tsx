type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="max-w-[90rem] mx-auto px-5">{children}</div>;
};

export default Container;
