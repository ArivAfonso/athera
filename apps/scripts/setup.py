from setuptools import setup, find_packages

setup(
    name='my_python_project',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        # add your project dependencies here
        # for example:
        # 'numpy',
        # 'requests',
    ],
    entry_points={
        'console_scripts': [
            'my_python_project = my_python_project.main:main',
        ],
    },
)