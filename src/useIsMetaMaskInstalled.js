const useIsMetaMaskInstalled = () => {
  const { ethereum } = window;
  return (ethereum && ethereum.isMetaMask);
};

export default useIsMetaMaskInstalled;
