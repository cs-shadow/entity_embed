<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Tests\EmbedButtonCrudTest.
 */

namespace Drupal\entity_embed\Tests;

use Drupal\Core\Config\Entity\ConfigEntityStorage;
use Drupal\entity_embed\EmbedButtonInterface;
use Drupal\file\Entity\File;
use Drupal\simpletest\KernelTestBase;

/**
 * Tests creation, loading and deletion of embed buttons.
 *
 * @group entity_embed
 */
class EmbedButtonCrudTest extends KernelTestBase {

  /**
   * Modules to enable.
   *
   * @var array
   */
  public static $modules = array('entity_embed');

  /**
   * The embed button storage.
   *
   * @var \Drupal\Core\Config\Entity\ConfigEntityStorageInterface.
   */
  protected $controller;

  protected function setUp() {
    parent::setUp();

    $this->controller = $this->container->get('entity.manager')->getStorage('entity_embed_button');
  }

  /**
   * Tests CRUD operations for embed buttons.
   */
  public function testEntityEmbedCrud() {
    $this->assertTrue($this->controller instanceof ConfigEntityStorage, 'The embed_button storage is loaded.');

    // Run each test method in the same installation.
    $this->createTests();
    $this->loadTests();
    $this->deleteTests();
  }

  /**
   * Tests the creation of embed_button.
   */
  protected function createTests() {
    $plugin = array(
      'id' => 'test_button',
      'label' => 'Testing embed button instance',
      'entity_type' => 'node',
      'entity_type_bundles' => array('article'),
      'button_icon_uuid' => '',
      'display_plugins' => array('default'),
    );

    // Create an embed_button with required values.
    $entity = $this->controller->create($plugin);
    $entity->save();

    $this->assertTrue($entity instanceof EmbedButtonInterface, 'The newly created entity is an Embed button.');

    // Verify all the properties.
    $actual_properties = $this->container->get('config.factory')->get('entity_embed.embed_button.test_button')->get();

    $this->assertTrue(!empty($actual_properties['uuid']), 'The embed button UUID is set.');
    unset($actual_properties['uuid']);

    $expected_properties = array(
      'langcode' => $this->container->get('language_manager')->getDefaultLanguage()->getId(),
      'status' => TRUE,
      'dependencies' => array(),
      'id' => 'test_button',
      'label' => 'Testing embed button instance',
      'entity_type' => 'node',
      'entity_type_bundles' => array('article'),
      'button_icon_uuid' => '',
      'display_plugins' => array('default'),
    );

    $this->assertIdentical($actual_properties, $expected_properties);
  }

  /**
   * Tests the loading of embed_button.
   */
  protected function loadTests() {
    $entity = $this->controller->load('test_button');

    $this->assertTrue($entity instanceof EmbedButtonInterface, 'The loaded entity is an embed button.');

    // Verify several properties of the embed button.
    $this->assertEqual($entity->label(), 'Testing embed button instance');
    $this->assertEqual($entity->getEntityTypeMachineName(), 'node');
    $this->assertTrue($entity->uuid());
  }

  /**
   * Tests the deletion of embed_button.
   */
  protected function deleteTests() {
    $entity = $this->controller->load('test_button');

    // Ensure that the storage isn't currently empty.
    $config_storage = $this->container->get('config.storage');
    $config = $config_storage->listAll('entity_embed.embed_button.');
    $this->assertFalse(empty($config), 'There are embed buttons in config storage.');

    // Delete the embed button.
    $entity->delete();

    // Ensure that the storage is now empty.
    $config = $config_storage->listAll('entity_embed.embed_button.');
    $this->assertTrue(empty($config), 'There are no embed buttons in config storage.');
  }

  /**
   * Tests the embed_button and file usage integration.
   */
  public function testEmbedButtonIcon() {
    $this->enableModules(['system', 'user', 'file']);

    $this->installSchema('file', ['file_usage']);
    $this->installConfig(['system']);
    $this->installEntitySchema('user');
    $this->installEntitySchema('file');

    $file1 = file_save_data(file_get_contents('core/misc/druplicon.png'));
    $file1->setTemporary();
    $file1->save();

    $file2 = file_save_data(file_get_contents('core/misc/druplicon.png'));
    $file2->setTemporary();
    $file2->save();

    $button = array(
      'id' => 'test_button',
      'label' => 'Testing embed button instance',
      'button_label' => 'Test',
      'entity_type' => 'node',
      'entity_type_bundles' => array('article'),
      'button_icon_uuid' => $file1->uuid(),
      'display_plugins' => array('default'),
    );

    $entity = entity_create('entity_embed_button', $button);
    $entity->save();
    $this->assertTrue(File::load($file1->id())->isPermanent());

    $entity->button_icon_uuid = $file2->uuid();
    $entity->save();

    $this->assertTrue(File::load($file1->id())->isTemporary());
    $this->assertTrue(File::load($file2->id())->isPermanent());

    $entity->delete();
    $this->assertTrue(File::load($file2->id())->isTemporary());
  }

}
