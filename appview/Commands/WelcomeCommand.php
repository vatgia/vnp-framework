<?php
/**
 * Created by vatgia-framework.
 * Date: 7/29/2017
 * Time: 8:06 PM
 */

namespace AppView\Commands;


use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class WelcomeCommand extends \VatGia\Helpers\Console\Command
{

    protected $name = 'say:welcome';
    protected $description = 'Say hello with someone';

    public function fire()
    {
        $hello = [
            'en' => 'Hello ',
            'vn' => 'Xin chào ',
            'fr' => 'Bonjour ',
            'cn' => '您好 ',
            'ru' => 'Здравствуйте',
            'kr' => '안녕하세요',
        ];

        $name = $this->input->getArgument('name');

        $lang = $this->input->getOption('lang');
        if ($lang) {
            if (!in_array($lang, array_keys($hello))) {
                $this->output->writeln('Dont support this language');
            } else {
                $this->output->writeln(sprintf('%s%s', $hello[$lang], $name));
            }
        } else {

//            $this->output->ask

            $this->output->writeln(sprintf('%s%s', $hello['en'], $name));
        }
    }

    protected function getArguments()
    {
        return [
            ['name', InputArgument::REQUIRED, 'Tell me your name?']
        ];
    }

    protected function getOptions()
    {
        return [
            ['lang', null, InputOption::VALUE_OPTIONAL, 'Language you want to display']
        ];
    }
}