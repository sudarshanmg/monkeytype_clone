import Textarea from '@/components/text-area';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="m-4">
        <h1 className="font-mono font-thin text-4xl text-yellow-300">
          monkey_type
        </h1>
      </header>
      <section className="flex flex-1 h-full justify-center items-center">
        <Textarea />
      </section>
    </div>
  );
};

export default Home;
